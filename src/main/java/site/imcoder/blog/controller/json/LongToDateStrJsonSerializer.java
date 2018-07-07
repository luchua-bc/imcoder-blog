package site.imcoder.blog.controller.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * ClassName:LongToDateStrJsonSerializer <br/>  
 * Function: 日期类型格式化，格式化为：yyyy-MM-dd HH:mm:ss 格式. 用法如下：<br/>
 * Reason:   @JsonSerialize(using=LongToDateStrJsonSerializer.class)
 *           @Column(name="BIRTHDAY")
 *           public Date getBirthday() {
 *              return birthday;
 *           }
 *          . <br/>
 * Date:     2016年9月10日 下午1:26:08 <br/>
 * @author   dengchao
 * @version   1.0
 * @since    JDK 1.7  
 * @see
 */
public class LongToDateStrJsonSerializer extends JsonSerializer<Long> {

	@Override
	public void serialize(Long value, JsonGenerator jgen, SerializerProvider arg2)
			throws IOException, JsonProcessingException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd | HH:mm:ss");
		String formattedDate = sdf.format(new Date(value));
		jgen.writeString(formattedDate);
	}
}  