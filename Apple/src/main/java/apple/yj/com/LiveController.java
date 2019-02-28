package apple.yj.com;

import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class LiveController {
	public LiveController() {
		System.out.println("LiveController ........... ");
	}
	@RequestMapping(value = "/live", method = RequestMethod.GET)
	public String  home(Locale locale, Model model) {
		return "live";
	}
}
